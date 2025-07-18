import { useState } from "react";
import type { Consultation, ConsultationCreate, ConsultationUpdate } from "@/types/consultation";
import { Button } from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";

interface ConsultationFormProps {
  consultation?: Consultation;
  onSubmit: (data: ConsultationCreate | ConsultationUpdate) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

export const ConsultationForm = ({
  consultation,
  onSubmit,
  onCancel,
  isEditing = false,
}: ConsultationFormProps) => {
  const [formData, setFormData] = useState({
    text: consultation?.text || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.text.trim()) {
      newErrors.text = "상담 내용을 입력해주세요.";
    } else if (formData.text.trim().length < 10) {
      newErrors.text = "상담 내용은 최소 10자 이상 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEditing ? "상담 내용 수정" : "새 상담 등록"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Textarea
            label="상담 내용"
            value={formData.text}
            onChange={(e) => handleInputChange("text", e.target.value)}
            error={errors.text}
            placeholder="상담 내용을 자세히 입력하세요"
            rows={8}
            required
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
            {isEditing ? "수정하기" : "등록하기"}
          </Button>
        </div>
      </form>
    </div>
  );
};
